import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './estudiante.entity';

// Mock del servicio
const mockEstudianteService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('EstudianteController', () => {
  let controller: EstudianteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstudianteController],
      providers: [
        {
          provide: EstudianteService,
          useValue: mockEstudianteService,
        },
      ],
    }).compile();

    controller = module.get<EstudianteController>(EstudianteController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('GET /estudiante', () => {
    it('debe retornar la lista completa de estudiantes', async () => {
      const estudiantesEsperados: Estudiante[] = [
        { id: 1, nombre: 'Ana García', codigo: '2024001' },
        { id: 2, nombre: 'Carlos López', codigo: '2024002' },
      ];

      mockEstudianteService.findAll.mockResolvedValue(estudiantesEsperados);

      const resultado = await controller.findAll();

      expect(mockEstudianteService.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(estudiantesEsperados);
    });

    it('debe retornar un arreglo vacío cuando no hay estudiantes', async () => {
      mockEstudianteService.findAll.mockResolvedValue([]);

      const resultado = await controller.findAll();

      expect(resultado).toEqual([]);
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('POST /estudiante', () => {
    it('debe crear un nuevo estudiante y retornarlo', async () => {
      const dto = { nombre: 'Juan Pérez', codigo: '2024003' };
      const estudianteCreado: Estudiante = { id: 3, ...dto };

      mockEstudianteService.create.mockResolvedValue(estudianteCreado);

      const resultado = await controller.create(dto);

      expect(mockEstudianteService.create).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual(estudianteCreado);
      expect(resultado.id).toBe(3);
    });

    it('debe pasar el DTO correctamente al servicio', async () => {
      const dto = { nombre: 'María Torres', codigo: '2024010' };
      const estudianteCreado: Estudiante = { id: 10, ...dto };

      mockEstudianteService.create.mockResolvedValue(estudianteCreado);

      await controller.create(dto);

      expect(mockEstudianteService.create).toHaveBeenCalledWith({
        nombre: 'María Torres',
        codigo: '2024010',
      });
    });
  });
});
