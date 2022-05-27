import { ApiBadRequestResponse, ApiNoContentResponse } from "@nestjs/swagger";

export const ApiBadValidationResponse = () =>
  ApiBadRequestResponse({
    description: "Запрос не прошел валидации",
  });

export const TokenUserNotFoundResponse = () =>
  ApiNoContentResponse({
    description: "Пользователь из токена не найден",
  });

export const ApiServiceNotFoundResponse = () =>
  ApiNoContentResponse({
    description: "Сервис не найден",
  });
