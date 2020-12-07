class Api::V1::MemosController < ApplicationController
  def create
    Memo.create(
      appearance: params[:appearanceMemo],
      breakfast: params[:breakfastMemo],
      lunch: params[:lunchMemo],
      dinner: params[:dinnerMemo],
      snack: params[:snackMemo],
      record_id: params[:record_id]
    )
  end
end
