class Api::V1::MemosController < ApplicationController
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
    record = Record.find(params[:id])
    memo = record.memo
    render json: memo
  end
end
