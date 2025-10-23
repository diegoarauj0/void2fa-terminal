export interface IDeleteAccountUseCase {
  deleteAccount: (id: string) => Promise<void>;
}
