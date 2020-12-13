module DeviseHelper
  def sign_up(user)
    post '/api/v1/auth', params: user
  end

  def sign_in(user)
    post '/api/v1/auth/sign_in', params: user
    response.headers.slice('uid', 'client', 'access_token')
  end

  def sign_out(token)
    delete '/api/v1/auth/sign_out', headers: token
  end

  def update_user(data, token)
    put '/api/v1/auth', params: data, headers: token
  end

  def delete_user(token)
    delete '/api/v1/auth', headers: token
  end
end
