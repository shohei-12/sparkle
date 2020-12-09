require 'rails_helper'

RSpec.describe 'Api::V1::Memos', type: :request do
  let(:record) { create(:record) }
  let(:memo) { create(:memo) }

  describe 'POST /api/v1/memos' do
    context 'when data is valid' do
      let(:valid_data) do
        {
          appearance: 'memo',
          breakfast: 'memo',
          lunch: 'memo',
          dinner: 'memo',
          snack: 'memo',
          record_id: record.id
        }
      end

      it 'save memo' do
        expect { save_memo(valid_data) }.to change(Memo, :count).by(1)
        expect(response.status).to eq 204
      end
    end

    context 'when data is invalid' do
      let(:invalid_data) do
        {
          appearance: 'memo',
          breakfast: 'memo',
          lunch: 'memo',
          dinner: 'memo',
          snack: 'memo',
          record_id: record.id + 1
        }
      end

      it 'not save memo' do
        expect { save_memo(invalid_data) }.to change(Memo, :count).by(0)
        expect(response.status).to eq 204
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

  describe 'PUT /api/v1/memos/:id/appearance' do
    let(:data) do
      {
        appearance: 'memo update'
      }
    end

    context 'when memo exists' do
      it 'update appearance memo' do
        update_appearance(memo.id, data)
        expect(response.status).to eq 204
        memo.reload
        expect(memo.appearance).to eq 'memo update'
      end
    end

    context 'when memo does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { update_appearance(memo.id + 1, data) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/memos/:id/breakfast' do
    let(:data) do
      {
        breakfast: 'memo update'
      }
    end

    context 'when memo exists' do
      it 'update breakfast memo' do
        update_breakfast(memo.id, data)
        expect(response.status).to eq 204
        memo.reload
        expect(memo.breakfast).to eq 'memo update'
      end
    end

    context 'when memo does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { update_breakfast(memo.id + 1, data) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/memos/:id/lunch' do
    let(:data) do
      {
        lunch: 'memo update'
      }
    end

    context 'when memo exists' do
      it 'update lunch memo' do
        update_lunch(memo.id, data)
        expect(response.status).to eq 204
        memo.reload
        expect(memo.lunch).to eq 'memo update'
      end
    end

    context 'when memo does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { update_lunch(memo.id + 1, data) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/memos/:id/dinner' do
    let(:data) do
      {
        dinner: 'memo update'
      }
    end

    context 'when memo exists' do
      it 'update dinner memo' do
        update_dinner(memo.id, data)
        expect(response.status).to eq 204
        memo.reload
        expect(memo.dinner).to eq 'memo update'
      end
    end

    context 'when memo does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { update_dinner(memo.id + 1, data) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'PUT /api/v1/memos/:id/snack' do
    let(:data) do
      {
        snack: 'memo update'
      }
    end

    context 'when memo exists' do
      it 'update snack memo' do
        update_snack(memo.id, data)
        expect(response.status).to eq 204
        memo.reload
        expect(memo.snack).to eq 'memo update'
      end
    end

    context 'when memo does not exist' do
      it 'raise ActiveRecord::RecordNotFound' do
        expect { update_snack(memo.id + 1, data) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
