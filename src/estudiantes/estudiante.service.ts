import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const existing = await this.estudianteRepository.findOne({
      where: { codigo: createEstudianteDto.codigo },
    });
    
    if (existing) {
      throw new ConflictException('Un estudiante con ese código ya existe');
    }

    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    return this.estudianteRepository.save(estudiante);
  }

  async findAll(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }
}
