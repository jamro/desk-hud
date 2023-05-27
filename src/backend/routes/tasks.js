const express = require('express')
const router = express.Router()
const { google } = require('googleapis');
const getEnv = require('../getEnv.js')

const auth = google.auth.fromJSON({
  type: "authorized_user",
  client_id: getEnv('DHUD_GOOGLE_CLIENT_ID'),
  client_secret: getEnv('DHUD_GOOGLE_CLIENT_SECRET'),
  refresh_token: getEnv('DHUD_GOOGLE_CLIENT_TOKEN'),
})
const tasks = google.tasks({ version: 'v1', auth });


router.get(`/`, async (req, res) => {
  const queryTodo = async (id) => {
    const response = await tasks.tasks.list({
      tasklist: getEnv(id)
    });

    return response.data.items
      .map(t => ({
        id: t.id,
        title: t.title,
        updated: new Date(t.updated).getTime(),
        position: t.position,
        status: t.status,
        completed: new Date(t.completed).getTime() || null,
        due: new Date(t.due).getTime() || null,
      }))
      .sort((a, b) => String(a.position).localeCompare(String(b.position)))
  }
  const inbox = await queryTodo('DHUD_GOOGLE_INBOX_TASKLIST_ID')
  const action = await queryTodo('DHUD_GOOGLE_ACTION_TASKLIST_ID')
  const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
  res.json({
    inbox: inbox.filter(t => !t.completed && !t.due),
    action: action.filter(t => !t.due && (!t.completed || t.completed > today)),
  })
})


module.exports = router