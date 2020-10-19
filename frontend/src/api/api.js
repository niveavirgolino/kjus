import jQuery from 'jquery';

function getCookie() {
  let name = 'csrftoken'
  var cookieValue = null
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i])
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue;
}

class API {
  static request(url, method, body) {
    let params = {
      method: method,
      mode: 'same-origin',
      // credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'X-CSRFToken': getCookie(),
      },
    }

    if (body.length > 0) {
      params['body'] = JSON.stringify(body)
    }

    return fetch(url, params).then(function(response) {
      return response.json();
    })
  }

  static getMain() {
    return fetch('/main/', {
      method: 'get',
      mode: 'same-origin',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie(),
      }
    }).then(function(response) {
      return response.json();
    })
  }

  static getUnidade(id) {
    return API.request('/unidade/' + id.toString() + '/', 'get', {
      id: id
    })
  }

  static getProcesso(id) {
    return API.request('/processo/' + id.toString() + '/', 'get', {
      id: id
    })
  }
}

export default API;
