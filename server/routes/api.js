const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Utility: compute contact as the "other" participant
function contactOf(msg) {
  return msg.direction === 'outbound' ? msg.to : msg.from;
}

// GET /api/conversations — list latest per contact
router.get('/conversations', async (req, res, next) => {
  try {
    const waId = req.query.wa_id || process.env.MY_NUMBER; // owner context
    const pipeline = [
      { $match: { wa_id: waId } },
      {
        $addFields: {
          contact: {
            $cond: [{ $eq: ['$direction', 'outbound'] }, '$to', '$from'],
          },
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$contact',
          last_message: { $first: '$text' },
          last_time: { $first: '$timestamp' },
          unread_count: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$direction', 'inbound'] }, { $ne: ['$status', 'read'] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $project: { _id: 0, wa_id: '$_id', contact: '$_id', last_message: 1, last_time: 1, unread_count: 1 } },
      { $sort: { last_time: -1 } },
      { $limit: 50 },
    ];
    const rows = await Message.aggregate(pipeline);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// GET /api/conversations/:contact/messages
router.get('/conversations/:contact/messages', async (req, res, next) => {
  try {
    const waId = req.query.wa_id || process.env.MY_NUMBER;
    const { contact } = req.params;
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const q = { wa_id: waId, $or: [{ from: contact }, { to: contact }] };
    const docs = await Message.find(q)
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json(docs);
  } catch (e) {
    next(e);
  }
});

// POST /api/conversations/:contact/messages — create outbound
router.post('/conversations/:contact/messages', async (req, res, next) => {
  try {
    const waId = req.query.wa_id || process.env.MY_NUMBER;
    const { contact } = req.params;
    const { text, meta_msg_id } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text is required' });

    const now = new Date();
    const doc = await Message.create({
      msg_id: `wamid.${Date.now()}`,
      meta_msg_id,
      wa_id: waId,
      from: waId,
      to: contact,
      text,
      type: 'text',
      direction: 'outbound',
      status: 'sent',
      timestamp: now,
    });
    res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Duplicate msg_id' });
    next(e);
  }
});

// PATCH /api/messages/:msg_id/status
router.patch('/messages/:msg_id/status', async (req, res, next) => {
  try {
    const { msg_id } = req.params;
    const { status } = req.body || {};
    const allowed = ['sent', 'delivered', 'read', 'unknown'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'invalid status' });
    const doc = await Message.findOneAndUpdate({ msg_id }, { status }, { new: true });
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// POST /api/webhook/process — dev-friendly
router.post('/webhook/process', async (req, res, next) => {
  try {
    const { kind, data } = req.body || {};
    if (!kind || !data) return res.status(400).json({ error: 'kind and data required' });

    if (kind === 'message') {
      const update = { $setOnInsert: { createdAt: new Date() }, $set: { ...data, updatedAt: new Date() } };
      const doc = await Message.findOneAndUpdate({ msg_id: data.msg_id }, update, {
        new: true,
        upsert: true,
      });
      return res.json({ ok: true, message: doc });
    }

    if (kind === 'status') {
      const { msg_id, meta_msg_id, status } = data;
      let doc = null;
      if (msg_id) doc = await Message.findOneAndUpdate({ msg_id }, { status }, { new: true });
      if (!doc && meta_msg_id)
        doc = await Message.findOneAndUpdate({ meta_msg_id }, { status }, { new: true });
      return res.json({ ok: true, message: doc });
    }

    return res.status(400).json({ error: 'unknown kind' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
