class Api::V1::MemosController < ApplicationController
  before_action :set_memo, only: %i[update_appearance update_breakfast update_lunch update_dinner update_snack]

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

  def update_appearance
    @memo.update(appearance: params[:appearance])
  end

  def update_breakfast
    @memo.update(breakfast: params[:breakfast])
  end

  def update_lunch
    @memo.update(lunch: params[:lunch])
  end

  def update_dinner
    @memo.update(dinner: params[:dinner])
  end

  def update_snack
    @memo.update(snack: params[:snack])
  end

  private

  def set_memo
    @memo = Memo.find(params[:id])
  end
end
