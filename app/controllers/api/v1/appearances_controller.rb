class Api::V1::AppearancesController < ApplicationController
  before_action :set_record

  def create
    return unless current_api_v1_user.records.include?(@record)

    Appearance.create(image: params[:image], record_id: @record.id)
  end

  def show
    render json: @record.appearances
  end

  private

  def set_record
    @record = Record.find(params[:id])
  end
end
