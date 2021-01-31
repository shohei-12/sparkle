module MealsHelper
  def add_meal(data, token)
    post '/api/v1/meals', params: data, headers: token
  end

  def get_meals(data)
    get "/api/v1/meals/#{data}"
  end
end
