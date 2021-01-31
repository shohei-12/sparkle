module AppearancesHelper
  def add_appearance(data, token)
    post '/api/v1/appearances', params: data, headers: token
  end

  def get_appearances(data)
    get "/api/v1/appearances/#{data}"
  end
end
