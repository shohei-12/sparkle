module UsersHelper
  def toggle_theme(data)
    put '/api/v1/toggle-theme', params: data
  end

  def get_user(id)
    get "/api/v1/users/#{id}"
  end
end
