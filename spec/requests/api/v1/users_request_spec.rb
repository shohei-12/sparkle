require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:token1) { sign_in({ email: user1.email, password: 'password' }) }
  let(:token2) { sign_in({ email: user2.email, password: 'password' }) }

  describe 'GET /api/v1/users/:id' do
    context 'when user exists' do
      before do
        follow({ **token1, id: user2.id })
        follow({ **token2, id: user1.id })
      end

      context 'when token is valid' do
        it 'get user' do
          get_user(user1.id, token1)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)['user']['id']).to eq user1.id
          expect(JSON.parse(response.body)['follow_list'][0]['id']).to eq user2.id
          expect(JSON.parse(response.body)['follower_list'][0]['id']).to eq user2.id
        end
      end

      context 'when token is invalid' do
        it 'raise NoMethodError' do
          expect { get_user(user1.id, nil) }.to raise_error(NoMethodError)
        end
      end
    end

    context 'when user does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_user(user1.id += 1, token1) }.to raise_error(ActiveRecord::RecordNotFound)
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
