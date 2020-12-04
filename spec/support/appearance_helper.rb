module AppearanceHelpers
  def save_appearance(data)
    post '/api/v1/appearances', params: data
  end

  def get_appearance(data)
    get '/api/v1/appearances', params: data
  end
end
