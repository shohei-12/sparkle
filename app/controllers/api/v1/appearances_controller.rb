class Api::V1::AppearancesController < ApplicationController
  def create
    Appearance.create(image: params[:image], record_id: params[:record_id])
  end
end
