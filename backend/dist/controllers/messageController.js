"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getConversationsList = exports.getConversation = exports.sendMessage = void 0;
const Message_1 = require("../models/Message");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { receiverId, propertyId, content } = req.body;
        if (!receiverId || !content) {
            res.status(400).json({ message: 'Receiver and content are required' });
            return;
        }
        const message = yield Message_1.Message.create({
            sender: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            receiver: receiverId,
            property: (propertyId || undefined),
            content
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const otherUserId = req.params.userId;
        const messages = yield Message_1.Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error });
    }
});
exports.getConversation = getConversation;
const getConversationsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Find latest message per conversation
        // Requires complex aggregation, simplified here for time to just get all distinct users we chatted with
        const messages = yield Message_1.Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .populate('sender', 'name email photoUrl')
            .populate('receiver', 'name email photoUrl')
            .sort({ createdAt: -1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error });
    }
});
exports.getConversationsList = getConversationsList;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const message = yield Message_1.Message.findById(req.params.id);
        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        // Only sender or receiver can delete
        if (message.sender.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && message.receiver.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            res.status(403).json({ message: 'Not authorized to delete this message' });
            return;
        }
        yield Message_1.Message.deleteOne({ _id: message._id });
        res.json({ message: 'Message deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting message', error });
    }
});
exports.deleteMessage = deleteMessage;
