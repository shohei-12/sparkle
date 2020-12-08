module MealHelpers
  def save_meal(data)
    post '/api/v1/meals', params: data
  end

  def get_meals(data)
    get "/api/v1/meals/#{data}"
  end
end
