class Api::V1::RecordsController < ApplicationController
  def create
    @user = User.find(params[:id])
    @record = @user.records.create(date: params[:date])
    render json: @record
  end
end
