module AppearanceHelpers
  def save_appearance(data)
    post '/api/v1/appearances', params: data
  end
end
