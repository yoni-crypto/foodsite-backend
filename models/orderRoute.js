import express from "express"
import authMiddleware from "../middleware/auth.js"
import { deleteOrder, listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js"

const orderRouter =express.Router()

orderRouter.post ('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userorders',authMiddleware,userOrders)
orderRouter.get('/list',listOrders)
orderRouter.post('/status',updateStatus)
orderRouter.post('/delete',deleteOrder)
export default orderRouter