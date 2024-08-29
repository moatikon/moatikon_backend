import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TikonEntity } from './tikon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TikonService {
  constructor(
    @InjectRepository(TikonEntity)
    tikonRepository: Repository<TikonEntity>
  ){}
}
