class Api::V1::MealsController < ApplicationController
  before_action :set_record

  def create
    return unless current_api_v1_user.records.include?(@record)

    Meal.create(
      image: params[:image],
      meal_type: params[:meal_type],
      record_id: @record.id
    )
  end

  def show
    render json: @record.meals
  end

  private

  def set_record
    @record = Record.find(params[:id])
  end
end
