import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { BankBranchesGetParams } from '../../client/generated/v4/bank-branches.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetBankBranchesSchema = {
  id: z.string().min(1).describe('Bank id returned by get_banks.'),
};

export type GetBankBranchesArgs = {
  id: string;
};

export async function getBankBranches(args: GetBankBranchesArgs) {
  const strict = z.object(GetBankBranchesSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Bank branches id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = BankBranchesGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Bank branches id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/banks/${encodeURIComponent(parsed.data.id)}/branches`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get bank branches');
}
