/* eslint camelcase: "off" */
/* global FormData */
import querystring from 'querystring'
import { cleanQuery } from './utils'

const BulkUpload = function (fetch, idToken) {
	const api = {
		uploads: {
			list () {
				return api.fetch(`uploads/?page_size=100`)
			},
			get (uploadId) {
				return api.fetch(`uploads/${uploadId}/`)
			},
			upload (collectionId, hint, file) {
				const data = new FormData()
				data.append('collection_id', collectionId)
				data.append('hint', hint)
				data.append('data_file', file)
				return api.fetch(`uploads/`, 'POST', data)
			}
		},
		itemResponses: {
			listByUpload (uploadId, options = {}) {
				const query = {
					upload: uploadId,
					only_user_errors: options.errorsOnly
				}
				const qs = querystring.stringify(cleanQuery(query))
				return api.fetch(`item-responses/?${qs}`)
			}
		}
	}

	api.fetch = function (url, method, body) {
		const headers = {
			'authorization': `JWT ${idToken}`,
			'Accept': 'application/json'
		}
		if (!(body instanceof FormData)) {
			headers['Content-Type'] = 'application/json'
		}
		return fetch(url, method, body, headers)
	}
	return api
}

export default BulkUpload
