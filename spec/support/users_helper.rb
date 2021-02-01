module UsersHelper
  def toggle_theme(data, token)
    put '/api/v1/toggle-theme', params: data, headers: token
  end

  def get_user(id)
    get "/api/v1/users/#{id}"
  end

  def get_20_followings(id, data, token)
    get "/api/v1/users/#{id}/followings", params: data, headers: token
  end

  def get_20_followers(id, data, token)
    get "/api/v1/users/#{id}/followers", params: data, headers: token
  end
end
