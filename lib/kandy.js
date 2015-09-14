var config = require('../config.json'),
    Client = require('node-rest-client').Client,
    client = new Client();

// API configuration
var apiURL = config['apiHost'] + '/' + config['version'];
var Devices = require('./Devices');
var Domains = require('./Domains');
var Users   = require('./Users');

module.exports = function (apiKey, domainApiSecret) {
    this.client = client;
    this.apiURL = apiURL;
    this.apiKey = apiKey;
    this.domainApiSecret = domainApiSecret;

    var options = {
        'apiURL'    : apiURL,
        'client'    : client
    };
    var devices = new Devices(options);
    var users = new Users(options);

    if(apiKey) {
        options['apiKey'] = apiKey;
    }
    if(domainApiSecret) {
        options['domainApiSecret'] = domainApiSecret;
    }
    var domains = new Domains(options);

    this.getUserAccessToken = domains.getUserAccessToken.bind(this);
    this.getInfoUserAccessToken = domains.getInfoUserAccessToken.bind(this);

    this.getDomainAccessToken = domains.getDomainAccessToken.bind(this);
    this.getInfoDomainAccessToken = domains.getInfoDomainAccessToken.bind(this);

    this.getListUsers = domains.getListUsers.bind(this);
    this.getInfoListUsers = domains.getInfoListUsers.bind(this);

    this.sendSms = devices.sendSms.bind(this);
    this.startSendSms = devices.startSendSms.bind(this);

    this.getAddressbook = users.getAddressbook.bind(this);
    this.getInfoAddressBook = users.getInfoAddressBook.bind(this);

    this.getGroups = users.getGroups.bind(this);
    this.getInfoGroups = users.getInfoGroups.bind(this);

    this.createGroup = users.createGroup.bind(this);
    this.sendInfoCreateGroup = users.sendInfoCreateGroup.bind(this);

    this.getGroupById = users.getGroupById.bind(this);
    this.sendInfoGroup = users.sendInfoGroup.bind(this);

    this.updateGroup = users.updateGroup.bind(this);
    this.sendInfoUpdateGroup = users.sendInfoUpdateGroup.bind(this);

    this.deleteGroup = users.deleteGroup.bind(this);
    this.sendInfoDelete = users.sendInfoDelete.bind(this);

    this.addGroupMembers = users.addGroupMembers.bind(this);
    this.sendInfoAddGroupMembers = users.sendInfoAddGroupMembers.bind(this);

    this.removeGroupMembers = users.removeGroupMembers.bind(this);

    this.leaveGroup = users.leaveGroup.bind(this);

    this.sendGroupIm = users.sendGroupIm.bind(this);
    this.sendInfoGroupIm = users.sendInfoGroupIm.bind(this);

    this.sendIm = devices.sendIm.bind(this);
    this.sendMessage = devices.sendMessage.bind(this);
    this.getUserDevice = devices.getUserDevice.bind(this);

    this.getIm = devices.getIm.bind(this);
    this.getDataForMessage = devices.getDataForMessage.bind(this);
    this.getMessagesChat = devices.getMessagesChat.bind(this);

};