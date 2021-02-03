class Api::V1::RecordsController < ApplicationController
  before_action :set_user, only: %i[show twenty_like_records]

  def create
    record = current_api_v1_user.records.create(date: params[:date])
    render json: record
  end

  def show
    record = @user.records.find_by(date: params[:date])
    render json: record
  end

  def index
    # Get 20 cases of data
    twenty_records = Record.limit(20).offset(params[:start])
    record_infos = Record.get_record_infos(twenty_records, current_api_v1_user)
    render json: record_infos
  end

  def twenty_like_records
    twenty_like_records = @user.like_records.limit(20).offset(params[:start])
    record_infos = Record.get_record_infos(twenty_like_records, current_api_v1_user)
    render json: record_infos
  end

  def related
    record = current_api_v1_user.records.find_by(date: params[:date])
    render json: { record_related: { appearances: Record.slice_images(record.appearances),
                                     breakfasts: Record.slice_images(record.meals.where(meal_type: 'breakfast')),
                                     lunchs: Record.slice_images(record.meals.where(meal_type: 'lunch')),
                                     dinners: Record.slice_images(record.meals.where(meal_type: 'dinner')),
                                     snacks: Record.slice_images(record.meals.where(meal_type: 'snack')),
                                     memo: record.memo.slice('appearance', 'breakfast', 'lunch', 'dinner', 'snack') },
                   record_id: record.id }
  end

  def comment_count
    record = Record.find(params[:id])
    render json: record.comment_count
  end

  def delete_images
    Record.delete_images(params[:appearances], params[:meals], current_api_v1_user.id)
  end

  def destroy
    record = Record.find(params[:id])
    record.destroy if record.user_id == current_api_v1_user.id
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
