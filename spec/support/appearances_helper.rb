module AppearancesHelper
  def save_appearance(data)
    post '/api/v1/appearances', params: data
  end

  def get_appearances(data)
    get "/api/v1/appearances/#{data}"
  end
end
