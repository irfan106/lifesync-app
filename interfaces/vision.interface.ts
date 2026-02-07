export interface IVisionItem {
  id: string;
  userId: string;
  title: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ICreateVisionDTO {
  title: string;
  imageUrl?: string;
}
