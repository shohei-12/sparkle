class Api::V1::MealsController < ApplicationController
  def create
    Meal.create(
      image: params[:image],
      record_id: params[:record_id],
      eating_time_id: params[:eating_time_id]
    )
  end
end
