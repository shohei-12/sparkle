module MealHelpers
  def save_meal(data)
    post '/api/v1/meals', params: data
  end
end
