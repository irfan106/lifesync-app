import { AxiosService } from './axios.service';

export class BaseService extends AxiosService {
  constructor(controller: string) {
    // For now we use a dummy URL or local env. 
    // In strict mode we might not even use this if directly using Firebase SDK,
    // but sticking to the requested architecture.
    super(`https://api.example.com/${controller}`);
  }
}
