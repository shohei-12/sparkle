class Api::V1::MemosController < ApplicationController
  before_action :set_record

  def create
    return unless current_api_v1_user.records.include?(@record)

    Memo.create(
      appearance: params[:appearance],
      breakfast: params[:breakfast],
      lunch: params[:lunch],
      dinner: params[:dinner],
      snack: params[:snack],
      record_id: @record.id
    )
  end

  def show
    render json: @record.memo
  end

  def update
    return unless @record.user_id == current_api_v1_user.id

    @record.memo.update(appearance: params[:appearance],
                        breakfast: params[:breakfast],
                        lunch: params[:lunch],
                        dinner: params[:dinner],
                        snack: params[:snack])
  end

  private

  def set_record
    @record = Record.find(params[:id])
  end
end
