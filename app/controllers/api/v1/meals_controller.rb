class Api::V1::MealsController < ApplicationController
  def create
    Meal.create(
      image: params[:image],
      meal_type: params[:meal_type],
      record_id: params[:record_id]
    )
  end

  def show
    record = Record.find(params[:id])
    images = record.meals
    render json: images
  end
end
