require 'rails_helper'

RSpec.describe 'Api::V1::Memos', type: :request do
  let(:record) { create(:record) }
  let(:memo) { create(:memo) }
  let(:user) { create(:user) }
  let(:token1) { sign_in({ email: record.user.email, password: 'password' }) }
  let(:token2) { sign_in({ email: user.email, password: 'password' }) }
  let(:valid_data) do
    {
      appearance: 'memo',
      breakfast: 'memo',
      lunch: 'memo',
      dinner: 'memo',
      snack: 'memo',
      id: record.id
    }
  end
  let(:invalid_data) do
    {
      appearance: 'memo',
      breakfast: 'memo',
      lunch: 'memo',
      dinner: 'memo',
      snack: 'memo',
      id: record.id + 1
    }
  end
  let(:update) do
    {
      appearance: 'memo update',
      breakfast: 'memo update',
      lunch: 'memo update',
      dinner: 'memo update',
      snack: 'memo update'
    }
  end

  describe 'POST /api/v1/memos' do
    context 'when token is valid' do
      context 'when it is record for current user' do
        it 'add memo' do
          expect { add_memo(valid_data, token1) }.to change(Memo, :count).by(1)
          expect(response.status).to eq 204
        end
      end

      context 'when it is not record for current user' do
        it 'not add memo' do
          expect { add_memo(valid_data, token2) }.to change(Memo, :count).by(0)
          expect(response.status).to eq 204
        end
      end
    end

    context 'when token is invalid' do
      it 'raise NoMethodError' do
        expect { add_memo(valid_data, nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe 'GET /api/v1/memos/:id' do
    context 'when record exists' do
      context 'when there is corresponding memo in record' do
        it 'get memo' do
          get_memo(memo.record_id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)['id']).to eq memo.id
        end
      end

      context 'when there is not corresponding memo in record' do
        it 'not get memo' do
          get_memo(record.id)
          expect(response.status).to eq 200
          expect(JSON.parse(response.body)).to eq nil
        end
      end
    end

    context 'when record does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { get_memo(record.id + 1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/memos/:id' do
    context 'when token is valid' do
      context 'when record creator matchs current user' do
        it 'update memo' do
          add_memo(valid_data, token1)
          update_memo(record.id, update, token1)
          expect(response.status).to eq 204
          memo = Memo.first
          expect(memo.appearance).to eq update[:appearance]
          expect(memo.breakfast).to eq update[:breakfast]
          expect(memo.lunch).to eq update[:lunch]
          expect(memo.dinner).to eq update[:dinner]
          expect(memo.snack).to eq update[:snack]
        end
      end

      context 'when record creator does not match current user' do
        it 'not update memo' do
          add_memo(valid_data, token1)
          update_memo(record.id, update, token2)
          expect(response.status).to eq 204
          memo = Memo.first
          expect(memo.appearance).to eq valid_data[:appearance]
          expect(memo.breakfast).to eq valid_data[:breakfast]
          expect(memo.lunch).to eq valid_data[:lunch]
          expect(memo.dinner).to eq valid_data[:dinner]
          expect(memo.snack).to eq valid_data[:snack]
        end
      end
    end

    context 'when token is invalid' do
      it 'raise NoMethodError' do
        expect { update_memo(record.id, update, nil) }.to raise_error(NoMethodError)
      end
    end
  end
end
