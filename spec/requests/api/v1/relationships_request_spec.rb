require 'rails_helper'

RSpec.describe 'Api::V1::Relationships', type: :request do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:token) { sign_in({ email: user1.email, password: 'password' }) }
  let(:valid_data) do
    {
      **token,
      id: user2.id
    }
  end

  describe 'POST /api/v1/relationships' do
    context 'when data is valid' do
      it 'follow' do
        expect { follow(valid_data) }.to change(Relationship, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      context 'when token is invalid' do
        let(:invalid_data) do
          {
            id: user2.id
          }
        end

        it 'raise NoMethodError' do
          expect { follow(invalid_data) }.to raise_error(NoMethodError)
        end
      end

      context 'when already following' do
        it 'not follow' do
          follow(valid_data)
          expect { follow(valid_data) }.to change(Relationship, :count).by(0)
          expect(response.status).to eq 204
        end
      end

      context 'when follow self' do
        let(:invalid_data) do
          {
            **token,
            id: user1.id
          }
        end

        it 'not follow' do
          expect { follow(invalid_data) }.to change(Relationship, :count).by(0)
          expect(response.status).to eq 204
        end
      end

      context 'when user does not exist' do
        let(:invalid_data) do
          {
            **token,
            id: user2.id += 1
          }
        end

        it 'raise ActiveRecord::RecordNotFound' do
          expect { follow(invalid_data) }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end

  describe 'DELETE /api/v1/relationships/:id' do
    context 'when following' do
      before { follow(valid_data) }

      it 'unfollow' do
        expect { unfollow(user2.id, token) }.to change(Relationship, :count).by(-1)
        expect(response.status).to eq 204
      end
    end

    context 'when not following' do
      it 'not unfollow' do
        expect { unfollow(user2.id, token) }.to change(Relationship, :count).by(0)
        expect(response.status).to eq 204
      end
    end
  end

  describe 'GET /api/v1/relationships/following/:id' do
    context 'when following' do
      before { follow(valid_data) }

      it 'return true' do
        following?(user2.id, token)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq true
      end
    end

    context 'when not following' do
      it 'return false' do
        following?(user2.id, token)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq false
      end
    end
  end
end
