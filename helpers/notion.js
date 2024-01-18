const Notion = {}
const CONFIG = require('../config')
const CONSTANTS = require('../constants')
const { Client } = require("@notionhq/client")
const User = require('../models/user')

// Initializing a client
const notion = new Client({
    auth: CONFIG.TOKENS.NOTION
})

async function searchUser(username){
	const users = [];
	if(!username)
		return users;
	const notionUsers = await notion.databases.query({
		database_id: CONFIG.NOTION_DATABASES.USERS,
		filter: {
			property: "username",
			rich_text: {
				equals: username
			}
		}
	});

	if(notionUsers.results.length > 0){
		for(let nUser of notionUsers.results){
			let id = nUser.id;
			let username = '';
			let password = '';
			let email = nUser.properties['email'].email;
			let tags = [];
			let reqInPeriod = nUser.properties['in period'].formula.number;
			let reqLimit = nUser.properties['requests limit'].formula.number;
			for(let nUsername of nUser.properties['username'].title){
				username = username + nUsername.text.content;
			}
			for(let nPassword of nUser.properties['password'].rich_text){
				password = password + nPassword.text.content;
			}
			for(let nTag of nUser.properties['tags'].multi_select){
				tags.push(nTag.name);
			}
			users.push(new User(id, username, password, email, tags, reqInPeriod, reqLimit))
		}
	}

	return users;
}

function parseToNotionTag(tags){
	const notionTags = []
	for(let tag of tags){
		notionTags.push({name: tag})
	}
	return notionTags;
}

Notion.retrieveUserByUsername = (username) => {
	return searchUser(username);
}

Notion.createRequestLog = async (ip, service, username) => {
	const notionUsers = await searchUser(username);
	const tags = [];
	const environment = CONFIG.ENVIRONMENT != undefined || CONFIG.ENVIRONMENT != null ? CONFIG.ENVIRONMENT : CONSTANTS.ENVIRONMENTS.TEST_ENV;
	tags.push(environment);

	const notionFormatTags = parseToNotionTag(tags);

	const notionUser = notionUsers.length>0 ? [{id: notionUsers[0].id}] : [];
	let properties = {
		IP: {
			title: [
				{
					text: {
						content: ip
					}
				}
			]
		},
		Servicio: {
			"select": {name: service}
		},
		Etiquetas: {
			multi_select: notionFormatTags
		},
		usuario: {
			relation: notionUser
		}
	}
	
	notion.pages.create({
		parent: {
			type: "database_id",
			database_id: CONFIG.NOTION_DATABASES.REQUESTS
		},
		properties: properties
	})
}

Notion.createUser = async (username, password, email, tags) => {
	const nTags = parseToNotionTag(tags);
	const properties = {
		username: {
			title: [
				{
					text: {
						content: username
					}
				}
			]
		},
		password: {
			rich_text: [
				{
					text: {
						content: password
					}
				}
			]
		},
		email: {
			email: email
		},
		tags: {
			multi_select: nTags.length>0 ? nTags : [{name: 'Standard'}]
		}
	}
	const userCreated = await notion.pages.create({
		parent: {
			type: "database_id",
			database_id: CONFIG.NOTION_DATABASES.USERS
		},
		properties: properties
	})
	return new User(userCreated.id, username, password, email, tags.length>0 ? tags : ['Standard'], userCreated.properties['in period'].formula.number, userCreated.properties['requests limit'].formula.number)
}

module.exports = Notion;