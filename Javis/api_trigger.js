import { Success, Fail, Codes, Tables, JwtVerify, JSONParser } from './lib/all'
const ResOK = (callback, res) => callback(null, Success(res))
const ResFail = (callback, res, code = Codes.Error) => callback(null, Fail(res, code))

import {PlatformUserModel} from "./model/PlatformUserModel"

import {PushModel} from "./model/PushModel"

import {UserModel} from "./model/UserModel"

import {UserBillModel} from "./model/UserBillModel"

import {TcpUtil} from "./lib/TcpUtil"


const userTrigger = async (e, c, cb) => {
    console.info(e.Records);
    console.info(e.Records[0].dynamodb);
    // console.info('test event')
    // console.info(e)
    // console.info('test context')
    // console.info(c)
    // console.log("xiangxi");
    // console.log(JSON.stringify(e));
    // console.log(JSON.stringify(c));
    // console.info('test dynamodb')
    // console.info(JSON.stringify(e.dynamodb));
    let record = e.Records[0].dynamodb.keys;
    let userId = record.userId.S;
    let userModel = new PlatformUserModel();
    let [error, userInfo] = userModel.get({userId}, [], "userIdIndex");
    let userModel = new UserModel();
    let pushModel = newPushModel({
        username : userInfo.username,
        id :userInfo.userId,
        role : userInfo.role,
        headPic : "",
        parentId : userInfo.parent,
        msn : userInfo.msn,
        gameList : userInfo.gameList
    })
    pushModel.pushMerchant();
}

const playerBalanceTrigger = async(e, c , cb){
    let record = e.Records[0].dynamodb.keys;
    let userId = +record.userId.N;
    let userBillModel = new UserBillModel();
    let [error, balance] = userBillModel.getBalanceByUid(userId);
    userInfo = userInfo || {};
    let pushModel = newPushModel({
        userId : userId,
        balance : balance
    })
    pushModel.pushUserBalance();
}

export {
    userTrigger                    // 用户表触发器
}