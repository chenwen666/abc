import { BizErr,Codes } from './Codes'
import { TOKEN_SECRET } from './secret/TokenSecret'
const Bluebird = require('bluebird')
const jwt = require('jsonwebtoken')
const jwtVerify = Bluebird.promisify(jwt.verify)

const responseTemplate = (statusCode, body, code, headers = {}) => {
  headers = {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
  const content = {
    ...body,
    code: code
  }
  return {statusCode, headers, body: JSON.stringify(content)}
}
// Response utils

export const Success = (body, code = Codes.OK, headers = {}) => {
  return responseTemplate(200, body, code, headers)
}
export const Fail = (body, code = Codes.Error, headers = {}) => {
  return responseTemplate(500, body, code, headers)
}

export const JwtVerify = async (data) => {
  try {
    const decoded = await jwtVerify(data,TOKEN_SECRET)
    return [0,decoded]
  } catch (e) {
    return [BizErr.TokenErr(),0]
  }
}

export const JwtSign = (data) =>{
  return jwt.sign(data,TOKEN_SECRET)
}


export const GeneratePolicyDocument = (principalId, effect, resource,userInfo) => {
	var authResponse = {};
	authResponse.principalId = principalId;
  authResponse.context = {}
  authResponse.context.username = userInfo.username
  authResponse.context.role = userInfo.role
  authResponse.context.userId = userInfo.userId
  authResponse.context.parent = userInfo.parent
	if (effect && resource) {
		var policyDocument = {};
		policyDocument.Version = '2012-10-17'; // default version
		policyDocument.Statement = [];
		var statementOne = {};
		statementOne.Action = 'execute-api:Invoke'; // default action
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}
	return authResponse;
}
