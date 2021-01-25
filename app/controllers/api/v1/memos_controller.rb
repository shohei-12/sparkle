class Api::V1::MemosController < ApplicationController
  before_action :set_record, only: %i[show update]

  def create
    Memo.create(
      appearance: params[:appearance],
      breakfast: params[:breakfast],
      lunch: params[:lunch],
      dinner: params[:dinner],
      snack: params[:snack],
      record_id: params[:record_id]
    )
  end

  def show
    render json: @record.memo
  end

  def update
    if @record.user_id == current_api_v1_user.id
      @record.memo.update(appearance: params[:appearance],
                          breakfast: params[:breakfast],
                          lunch: params[:lunch],
                          dinner: params[:dinner],
                          snack: params[:snack])
    end
  end

  private

  def set_record
    @record = Record.find(params[:id])
  end
end
