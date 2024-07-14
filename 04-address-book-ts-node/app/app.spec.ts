import test from 'ava'

import {app} from './server'

test('server should be ok', async (t) => {

  t.truthy(app)
})
