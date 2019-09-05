var NCCSN = '';
var isca = '';
var usercode = '';
var signType = 'NCC';
var transType = 'NCC';
function sn(usercode, isca) {
	var result = '';
	if (!isca) {
		if (signType == 'NCC') {
			return usercode;
		} else {
			//ca根据type判断，type为本文件配置
			throw new Error('需要CA认证，但是未安装相应代码');
		}
	} else {
		//硬KEY
		throw new Error('需要CA认证，但是未安装相应代码');
	}
	return result;
}
function sign(value, uid, needpsw, isca) {
	var result = '';
	if (!isca) {
		if (signType == 'NCC') {
			return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(uid + value));
		} else {
			//ca根据type判断，type为本文件配置
			throw new Error('需要CA认证，但是未安装相应代码');
		}
	} else {
		//硬KEY
		throw new Error('需要CA认证，但是未安装相应代码');
	}
	return result;
}
function superSign(value, usercode, needpsw, isca) {
	var result = {};
	try {
		result.status = 0;
		result.sn = sn(usercode, isca);
		result.signStr = sign(value, usercode, needpsw, isca);
	} catch (e) {
		result.status = 1;
		result.msg = e.message;
	}
	return result;
}
function transSn(usercode) {
	var result = '';
	if (transType == 'NCC') {
		result = usercode;
	} else {
		//ca根据type判断，type为本文件配置
		throw new Error('需要CA认证，但是未安装相应代码');
	}
	return result;
}
//传输签名一定是不需要密码的
function transSign(value, uid) {
	var result = '';
	if (transType == 'NCC') {
		result = CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(uid + value));
	} else {
		//ca根据type判断，type为本文件配置
		throw new Error('需要CA认证，但是未安装相应代码');
	}
	return result;
}
