require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:record) { create(:record) }

  describe 'GET /api/v1/users/:id' do
    context 'when user exists' do
      it 'get user' do
        user1.follow(user2)
        user2.follow(user1)
        user1.like(record)
        get_user(user1.id)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['user']['id']).to eq user1.id
        expect(JSON.parse(response.body)['followings']).to eq 1
        expect(JSON.parse(response.body)['followers']).to eq 1
        expect(JSON.parse(response.body)['likes']).to eq 1
      end
    end

    context 'when user does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_user(user1.id += 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/toggle-theme' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          id: user1.id,
          theme: 'dark'
        }
      end

      it 'toggle theme' do
        toggle_theme(valid_data)
        expect(response.status).to eq 204
        user1.reload
        expect(user1.theme).to eq 'dark'
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          id: user1.id,
          theme: 'darkk'
        }
      end

      it 'not toggle theme' do
        toggle_theme(invalid_data)
        expect(response.status).to eq 204
        user1.reload
        expect(user1.theme).to eq 'light'
      end
    end
  end
end
