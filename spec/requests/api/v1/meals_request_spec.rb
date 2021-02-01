require 'rails_helper'

RSpec.describe 'Api::V1::Meals', type: :request do
  let(:record) { create(:record) }
  let(:user) { create(:user) }
  let(:token) { sign_in({ email: user.email, password: 'password' }) }
  let(:meal) { create(:meal) }
  let(:image) { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/test.jpg'), 'image/jpeg') }
  let(:data) do
    {
      image: image,
      meal_type: 'breakfast',
      id: record.id
    }
  end

  describe 'POST /api/v1/meals' do
    context 'when token is valid' do
      context 'when it is record for current user' do
        before do
          record = create(:record)
          @token = sign_in({ email: record.user.email, password: 'password' })
          @data = { image: image, meal_type: 'breakfast', id: record.id }
        end

        it 'add meal' do
          expect { add_meal(@data, @token) }.to change(Meal, :count).by(1)
          expect(response.status).to eq 204
        end
      end

      context 'when it is not record for current user' do
        it 'not add meal' do
          expect { add_meal(data, token) }.to change(Meal, :count).by(0)
          expect(response.status).to eq 204
        end
      end
    end

    context 'when token is invalid' do
      it 'raise NoMethodError' do
        expect { add_meal(data, nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe 'GET /api/v1/meals' do
    context 'when record exists' do
      context 'when there is corresponding meals in record' do
        it 'get meals' do
          get_meals(meal.record_id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)[0]['id']).to eq meal.id
        end
      end

      context 'when there is not corresponding meals in record' do
        it 'not get meals' do
          get_meals(record.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)).to eq []
        end
      end
    end

    context 'when record does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_meals(record.id + 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
