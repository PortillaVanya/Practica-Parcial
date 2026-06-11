import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';

// Mock del repositorio de TypeORM
const mockRepositoryFactory = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: jest.Mocked<Repository<Estudiante>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(Estudiante),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get(getRepositoryToken(Estudiante));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('debe retornar un arreglo de estudiantes', async () => {
      const estudiantesEsperados: Estudiante[] = [
        { id: 1, nombre: 'Ana García', codigo: '2024001' },
        { id: 2, nombre: 'Carlos López', codigo: '2024002' },
      ];

      repository.find.mockResolvedValue(estudiantesEsperados);

      const resultado = await service.findAll();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(estudiantesEsperados);
      expect(resultado).toHaveLength(2);
    });

    it('debe retornar un arreglo vacío si no hay estudiantes', async () => {
      repository.find.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('debe crear y retornar un nuevo estudiante', async () => {
      const dto = { nombre: 'Juan Pérez', codigo: '2024003' };
      const estudianteCreado: Estudiante = { id: 3, ...dto };

      repository.findOne.mockResolvedValue(null); // no existe aún
      repository.create.mockReturnValue(estudianteCreado);
      repository.save.mockResolvedValue(estudianteCreado);

      const resultado = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigo: dto.codigo },
      });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(estudianteCreado);
      expect(resultado).toEqual(estudianteCreado);
    });

    it('debe lanzar ConflictException si el código ya existe', async () => {
      const dto = { nombre: 'Otra Persona', codigo: '2024001' };
      const estudianteExistente: Estudiante = {
        id: 1,
        nombre: 'Ana García',
        codigo: '2024001',
      };

      repository.findOne.mockResolvedValue(estudianteExistente);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow(
        'Un estudiante con ese código ya existe',
      );

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('debe validar que nombre y codigo no estén vacíos', async () => {
      const dto = { nombre: 'Nuevo Estudiante', codigo: '2024099' };
      const estudianteCreado: Estudiante = { id: 10, ...dto };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(estudianteCreado);
      repository.save.mockResolvedValue(estudianteCreado);

      const resultado = await service.create(dto);

      expect(resultado.nombre).toBe('Nuevo Estudiante');
      expect(resultado.codigo).toBe('2024099');
    });
  });
});
