module UsersHelper
  def toggle_theme(data)
    put '/api/v1/toggle-theme', params: data
  end

  def get_user(id, token)
    get "/api/v1/users/#{id}", headers: token
  end
end
