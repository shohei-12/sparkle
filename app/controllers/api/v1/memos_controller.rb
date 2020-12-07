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
end
