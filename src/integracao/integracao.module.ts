import { Module} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntegracaoService } from './integracao.service';
import { IntegracaoController } from './integracao.controller';

@Module({
    imports: [HttpModule],
    providers: [IntegracaoService],
    controllers: [IntegracaoController],
  })
export class IntegracaoModule {}
