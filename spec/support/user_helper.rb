module UserHelpers
  def toggle_theme(data)
    put '/api/v1/toggle-theme', params: data
  end
end
